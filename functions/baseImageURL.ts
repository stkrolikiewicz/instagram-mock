exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      url: process.env.BASE_IMAGE_URL,
    }),
  }
}