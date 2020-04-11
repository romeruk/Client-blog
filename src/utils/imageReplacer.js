export default (content) => {
  return content.replace(/<img[^>]*>/g, "");
}