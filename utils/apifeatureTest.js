class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Remove fields that are not part of filtering
    const queryObj = { ...this.queryString };

    console.log("hello1", queryObj);

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    console.log("hello2", queryObj);

    // 1B) Advanced filtering: Replace query operators with MongoDB syntax
    let queryStr = JSON.stringify(queryObj);

    console.log("hello33", queryStr);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    console.log("hello3443", queryStr);

    this.query = this.query.find(JSON.parse(queryStr));

    console.log("hello34434444", queryStr);

    return this;
  }

  //   sort() {
  //     if (this.queryString.sort) {
  //       const sortBy = this.queryString.sort.split(",").join(" ");

  //       console.log("hello", sortBy);

  //       this.query = this.query.sort(sortBy);
  //     } else {
  //       this.query = this.query.sort("-createdAt");
  //     }

  //     return this;
  //   }

  sort() {
    if (this.queryString.sort) {
      let sortBy;

      console.log("One", this.queryString.sort);

      // Check if this.queryString.sort is an array or string
      if (Array.isArray(this.queryString.sort)) {
        // Join the array into a single string with commas
        sortBy = this.queryString.sort.join(",");

        console.log("Two", this.queryString.sort);
      } else {
        // If it's already a string, use it directly
        sortBy = this.queryString.sort;

        console.log("Three", this.queryString.sort);
      }

      // Convert the comma-separated values to space-separated for MongoDB
      sortBy = sortBy.split(",").join(" ");

      this.query = this.query.sort(sortBy);
      console.log("three", sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
