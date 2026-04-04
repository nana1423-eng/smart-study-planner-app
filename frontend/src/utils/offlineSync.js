import localforage from 'localforage';

localforage.config({
  name: 'SmartStudyPlanner',
  storeName: 'api_cache_store'
});

export const cacheData = async (key, data) => {
  try {
    await localforage.setItem(key, data);
  } catch (err) {
    console.error(`Failed to cache ${key}:`, err);
  }
};

export const getCachedData = async (key) => {
  try {
    return await localforage.getItem(key);
  } catch (err) {
    console.error(`Failed to get cached ${key}:`, err);
    return null;
  }
};

export const queueRequest = async (request) => {
  const queue = await getCachedData('offline_queue') || [];
  queue.push(request);
  await cacheData('offline_queue', queue);
};

export const processQueue = async (apiInstance) => {
  const queue = await getCachedData('offline_queue');
  if (!queue || queue.length === 0) return;

  console.log("Internet restored. Processing offline queue...", queue.length, "items.");
  
  const remainingQueue = [];
  for (const req of queue) {
    try {
      await apiInstance.request({
        method: req.method,
        url: req.url,
        data: req.data,
      });
      console.log(`Successfully synced offline request to ${req.url}`);
    } catch (err) {
      console.error(`Failed to sync offline request to ${req.url}:`, err);
      // Keep in queue if it wasn't a 4xx error (e.g. server still down)
      if (!err.response || err.response.status >= 500) {
         remainingQueue.push(req);
      }
    }
  }
  
  await cacheData('offline_queue', remainingQueue);
};
