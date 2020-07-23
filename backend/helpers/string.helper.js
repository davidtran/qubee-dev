function generateUniqueString() {
  return  Math.random().toString(36).substring(2, 15) + Date.now().toString(36).substring(2, 15);
}

function generateFolderSlug(title) {
  return title.toLowerCase().replace(/\s+/g, '-');
}

module.exports = { generateUniqueString, generateFolderSlug };
