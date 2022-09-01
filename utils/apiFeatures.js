class API_FEATURES {
  constructor(DBquery, UserQuery) {
    this.DB = DBquery;
    this.query = UserQuery;
    this.excludedFields = ['fields', 'sort', 'page', 'limit'];
  }

  filter() {
    let queries = { ...this.query };

    this.excludedFields.forEach((field) => delete queries[field]);

    queries = JSON.parse(
      JSON.stringify(queries).replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`)
    );

    this.DB = this.DB.find(queries);

    return this;
  }

  fields() {
    const queryKeys = Object.keys(this.query);
    if (!queryKeys.includes('fields')) return this;

    const fieldsQuery = this.query.fields.split(',').join(' ');

    this.DB = this.DB.select(fieldsQuery);

    return this;
  }
}

module.exports = API_FEATURES;
