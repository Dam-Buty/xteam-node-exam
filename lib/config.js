
const _ = {
  ///////////
  // Basic config
  TAGS_FILE: 'tags.txt',
  DATA_FOLDER: "data",
  ///////////
  // Cache constants
  FILE_LIST: ".cache.fileList.json",
  CACHE_FILE: ".cache.content.json",
  FRESH: null,
  NO_CACHE: 1,
  STALE_CACHE: 2,
  UNREADABLE_CACHE: 3,
  ///////////
  // getFromFiles constants
  NO_DATA_FOLDER: 1,
  EMPTY_DATA_FOLDER: 2,
  NO_VALID_DATA: 3,
  ///////////
  // getFromFiles constants
  EMPTY_TAG_LIST: 1
}
module.exports = _
