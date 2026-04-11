const asyncHandler = (requestHandlre) => {
  return (req, res, next) => {
    Promise.resolve(requestHandlre(req, res, next)).catch((err) => {
      next(err)
    })
  }
}

export { asyncHandler }