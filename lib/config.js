'use strict'

const _ = {
  ///////////
  // Basic config
  TAGS_FILE: "tags.txt",
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
  NO_TAG_LIST: 1,
  EMPTY_TAG_LIST: 2,
  ///////////
  // CLI Return Codes & special blocks
  RC_NO_ERROR: 0,
  RC_NO_TAG_LIST: 1,
  RC_EMPTY_TAG_LIST: 2,
  RC_NO_DATA: 3,
  CLEAR_SCREEN: '\x1Bc'
}

module.exports = _
