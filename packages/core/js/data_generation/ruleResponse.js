export class RuleResponse {
  constructor(isError, errorMessage, data) {
    this.isError = isError ? isError : false;
    this.errorMessage = errorMessage ? errorMessage : '';
    this.data = data ? data : '';
  }
}

export function errorResponse(errorMessage) {
  return new RuleResponse(true, errorMessage, '');
}

export function dataResponse(data) {
  return new RuleResponse(false, '', data);
}
