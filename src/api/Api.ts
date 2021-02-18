enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const fetchApi = (url: string, method: HTTPMethod, postData?: object): Promise<Response> => {
  let requestOptions: RequestInit = {
    credentials: 'include',
    method: method,
  }

  if (method == HTTPMethod.POST && postData) {
    requestOptions.headers = {
      'Content-Type': 'application/json;charset=utf-8'
    }
    requestOptions.body = JSON.stringify(postData);
  }

  return fetch(url, requestOptions);
}

export {
  fetchApi as fetchApi,
  HTTPMethod as HTTPMethod,
}