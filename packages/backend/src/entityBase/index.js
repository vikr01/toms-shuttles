export class EntityBase {
  constructor(...values) {
    Object.assign(this, ...values);
  }
}

export default EntityBase;
