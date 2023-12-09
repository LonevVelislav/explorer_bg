class QueryManipulation {
    constructor(query, requestQuery) {
        this.query = query;
        this.requestQuery = requestQuery;
    }

    filter() {
        const queryCopy = { ...this.requestQuery };
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el) => delete queryCopy[el]);

        let queryString = JSON.stringify(queryCopy);

        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
        this.query = this.query.find(JSON.parse(queryString));

        return this;
    }

    sort() {
        if (this.requestQuery.sort) {
            const sortBy = this.requestQuery.sort.split(",").join(" ");
            this.query.sort(sortBy);
        } else {
            this.query.sort("-createdAt");
        }
        return this;
    }

    filterFields() {
        if (this.requestQuery.fields) {
            const fields = this.requestQuery.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select("-__v");
            this.query = this.query.select("-secretPhoto");
            this.query = this.query.select("-imagefile");
        }
        return this;
    }

    paginate() {
        const page = this.requestQuery.page * 1 || 1;
        const limit = this.requestQuery.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    searchByUserId() {
        if (this.requestQuery.owner) {
            const ownerId = this.requestQuery.owner;
            this.query = this.query.find({ owner: ownerId });
        }
        return this;
    }

    searchByPhotoId() {
        if (this.requestQuery.photoId) {
            const photoId = this.requestQuery.photoId;
            this.query = this.query.find({ photoId: photoId });
        }
        return this;
    }
    searchByName() {
        if (this.requestQuery.name) {
            const name = this.requestQuery.name;
            const regex = new RegExp(name, "i");
            this.query = this.query.find({ name: regex });
        }
        return this;
    }
}

module.exports = QueryManipulation;
