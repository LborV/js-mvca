
//This file was automaticaly generated
//Feel free to edit :)

var Action = require('../kernel/Action');

class deleteAction extends Action {
    request(data) {
        if(data.error !== undefined) {
            return this.response({error: data.error});
        }

        todos
            .update({
                status: 'deleted'
            })
            .where('id', data.id)
            .execute();

        let res = todos.getAll();
        redis.set('allTodos', res);

        this.broadcast(res);
    }
}

let obj = new deleteAction('delete', [validateID]);
module.exports = obj;
