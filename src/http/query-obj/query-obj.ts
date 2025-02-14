interface QueryMap {
  [key: string]: unknown;
}

export class QueryObj {
  private static makeQueryParameter = (propertyName: string, value: unknown) => {
    return `${propertyName}=${value}`;
  };

  static makeQuery(queryObj: QueryMap) {
    const newQueryArray = ['?'];
    const newQueryObj = Object.entries(queryObj);

    newQueryObj.forEach(KeyValue => {
      newQueryArray.push(QueryObj.makeQueryParameter(KeyValue[0], KeyValue[1]));
    });

    return newQueryArray.join('&').replace('?&', '?');
  }
}
