exports.ListView = class {
  static get view() {
    return 'admin/list-view'
  }

  static get dataset() {
    return { name: 'admin' }
  }

  static as_controller() {
    return (_, reply) => {
      reply.render(this.view, this.dataset)
    };
  }
};
