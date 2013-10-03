Template.new_task.isUser = function () {
    return Meteor.user();
};

Template.new_task.isNotSending = function () {
    return !Session.equals('newTaskSending', true);
};



Template.new_task.isTypeSelection = function () {
    return Session.equals('newTaskStatus', 'type');
};

Template.new_task.isPrioritySelection = function () {
    return Session.equals('newTaskStatus', 'priority');
};

Template.new_task.isDelaySelection = function () {
    return Session.equals('newTaskStatus', 'delay');
};

Template.new_task.isNameSelection = function () {
    return Session.equals('newTaskStatus', 'name');
};

Template.new_task.isCreated = function () {
    return Session.equals('newTaskStatus', 'created');
};


Template.new_task.type = function () {
    return Session.get('newTaskType');
};

Template.new_task.title = function () {
    return Session.get('newTaskName');
};

Template.new_task.delivery = function () {
    return Session.get('newTaskDelay') === 'delivered' ? 'delivered' : (new Date( Session.get('newTaskDelay') )).toLocaleString();
};


Template.new_task.taskTitle = function () {

    if (Session.equals('newTaskType', 'Text')) {
        return 'Enter task title:';
    }

    if (Session.equals('newTaskType', 'Call')) {
        return 'Enter person you want to call:';
    }

    if (Session.equals('newTaskType', 'Mail')) {
        return 'Enter person you want to mail:';
    }


};

Template.new_task.taskPlaceholder = function () {

    if (Session.equals('newTaskType', 'Text')) {
        return 'Task title';
    }

    if (Session.equals('newTaskType', 'Call')) {
        return 'Name';
    }

    if (Session.equals('newTaskType', 'Mail')) {
        return 'Name';
    }


};


Template.new_task.textType = function () {
    return Session.equals('newTaskType', 'Text');
};

Template.new_task.callType = function () {
    return Session.equals('newTaskType', 'Call');
};

Template.new_task.mailType = function () {
    return Session.equals('newTaskType', 'Mail');
};





Template.new_task.friends = function () {

    var settings = Settings.findOne({ user : Session.get('userID')});

    console.log('settings', settings);
    console.log('userID', Session.get('userID'));

    if (settings) {
        console.log('return', settings.friends);
        return settings.friends;
    }
    return false;
};





Template.new_task.events({

    'click button.type-button': function (event, template) {
        Session.set('newTaskType', event.target.attributes['data-type'].nodeValue);
        Session.set('newTaskStatus', 'delay');
    },

    'click button.delay-button': function (event, template) {
        var now = (new Date()).getTime(),
            delay = +event.target.attributes['data-delay'].nodeValue,
            delivery = now + (delay * 1000 * 60);

        Session.set('newTaskDelay', delivery);
        Session.set('newTaskDelayString', delay);
        Session.set('newTaskStatus', 'priority');
    },

    'click button.priority-button': function (event, template) {
        Session.set('newTaskPriority', +event.target.attributes['data-priority'].nodeValue);
        Session.set('newTaskStatus', 'name');
    },

    'click button.name-button': function (event, template) {
        template.find('#new-task-name').value = event.target.attributes['data-name'].nodeValue;
    },

    'click button#cancel-task-btn': function (event, template) {
        Session.set('newTaskStatus', false);
        Session.set('newTaskType', false);
        Session.set('newTaskName', false);
        Session.set('newTaskDelay', false);
        Session.set('newTaskDelayString', false);
        Session.set('newTaskCreated', false);
        Session.set('newTaskSending', false);
        Session.set('newTaskPriority', false);
    },

    

    'click button#save-task-btn': function (event, template) {

        var user = Meteor.users.findOne({_id:Meteor.userId()}),
            userID = user._id,
            userEmail = user.emails[0].address,
            taskName = template.find('#new-task-name').value,
            delivery = Session.get('newTaskDelay') || 0,
            taskID = Tasks.insert({
                user: Session.get('userID'),
                name: 'Call: ' + taskName,
                sent: false,
                type: Session.get('newTaskType')
            });

        Session.set('newTaskName', taskName);
        Session.set('newTaskSending', true);

        Meteor.call('updateSettings', 'friends', taskName);

        Meteor.call('sendEmail',
                    userEmail,
                    userEmail,
                    Session.get('newTaskType') + ': ' + taskName,
                    Session.get('newTaskType') + ': ' + taskName,
                    taskID,
                    delivery,
                    Session.get('newTaskPriority'),
                    emailCallback);


    }

});


function emailCallback (error, result) {

    console.log('emailCallback error', error);
    console.log('emailCallback result', result);

    Session.set('newTaskSending', false);

    if (result) {

        var taskID = result.taskID;

        Tasks.update(taskID, {
            $set: {
                sent: true
            }
        });

        Session.set('newTaskDelay', 'delivered');
        Session.set('newTaskStatus', 'created');

    } else if (error) {

        console.error('error status:', error.error);

    } else {

        Session.set('newTaskStatus', 'created');

    }

}