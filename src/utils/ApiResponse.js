class APIResponse {
  constructor(
    statuscode,
    message = "success",
    data
  ) {
    this.data = data,
      this.message = message
    this.success = statuscode < 400
  }
}

export { APIResponse }