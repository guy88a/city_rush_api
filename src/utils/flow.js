// src/utils/flow.js

class Flow {
  constructor(context = {}) {
    this.context = context;
    this.error = null;
    this.status = 400;
    this.chain = Promise.resolve(); // internal promise chain
  }

  static start(context = {}) {
    return new Flow(context);
  }

  check(condition, message, status = 400) {
    this.chain = this.chain.then(() => {
      if (this.error) return;
      if (!condition) {
        this.error = message;
        this.status = status;
      }
    });

    return this;
  }

  step(fn) {
    this.chain = this.chain.then(async () => {
      if (this.error) return;

      try {
        const result = await fn(this.context);

        if (result && result.error) {
          this.error = result.error;
          this.status = result.status || 400;
        }
      } catch (err) {
        this.error = err.message || "Flow step failed";
        this.status = 500;
      }
    });

    return this;
  }

  async done(success) {
    await this.chain;

    if (this.error) {
      return {
        ok: false,
        status: this.status,
        message: this.error,
      };
    }

    // If success is a function → call it with the final context
    if (typeof success === "function") {
      return {
        ok: true,
        status: 200,
        data: success(this.context),
      };
    }

    // If success is object → return it directly
    return {
      ok: true,
      status: 200,
      data: success || this.context,
    };
  }

}

module.exports = Flow;
