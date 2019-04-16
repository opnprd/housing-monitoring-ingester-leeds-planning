module.exports = {
  slice: (num) => {
    return (data) => data.slice(0, num)
  },
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
}