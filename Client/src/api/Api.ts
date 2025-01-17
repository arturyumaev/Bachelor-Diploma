enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const fetchApi = (entity: string, method: HTTPMethod, postData?: object): Promise<Response> => {
  const protocol = 'http';
  const host = 'localhost';
  const port = 3000;
  const url = `${protocol}://${host}:${port}/${entity}`;
  
  let requestOptions: RequestInit = {
    credentials: 'include',
    method: method,
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    }
  };

  if ((method == HTTPMethod.POST || method == HTTPMethod.PUT) && postData) {
    requestOptions.body = JSON.stringify(postData);
  }

  return fetch(url, requestOptions);
};

export {
  fetchApi as fetchApi,
  HTTPMethod as HTTPMethod,
};
