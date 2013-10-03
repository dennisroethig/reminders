Template.task_list.isUser = function () {
    return Meteor.user();
};

Template.task_list.tasks = function () {
    return Tasks.find(filter_selections[Session.get('filter')], {sort: {created_at: 1}});
};

Template.task_list.sent = function () {
    return this.sent ? 'sent' : '';
};


Template.task_list.allCount = function () {
    return Tasks.find().count();
};

Template.task_list.sentCount = function () {
    return Tasks.find({sent: true}).count();
};

Template.task_list.pendingCount = function () {
    return Tasks.find({sent: false}).count();
};

Template.task_list.activeFilter = function (filter) {
    return Session.get('filter') === filter ? 'active' : '';
};

Template.task_list.typeIcon = function () {

    if (this.type === 'call') {
        return 'earphone';
    }

    if (this.type === 'mail') {
        return 'envelope';
    }

    if (this.type === 'text') {
        return 'align-justify';
    }

};




Template.task_list.events({

    'click button.remove-task': function (event, template) {
        var taskID = event.target.attributes['data-id'].nodeValue;
        Tasks.remove(taskID);
    }

});