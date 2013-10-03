Tasks = new Meteor.Collection('tasks');

Settings = new Meteor.Collection('settings');

Meteor.publish('tasks', function () {
    return Tasks.find({
        user: this.userId
    }, {
        // fields: {secretInfo: 1}
    });
});

// Meteor.publish('settings', function () {
//     return Settings.find();
// });


Meteor.publish("settings", function () {
    return Settings.find({
        user: this.userId
    }, {
        // fields: {secretInfo: 1}
    });
});





Tasks.allow({

    insert: function () {
        return true;
    },

    update: function () {
        return true;
    },

    remove: function () {
        return true;
    }

});

Settings.allow({

    insert: function () {
        return true;
    },

    update: function () {
        return true;
    },

    remove: function () {
        return true;
    }

});

Meteor.methods({

    sendEmail: function (to, from, subject, text, taskID, delivery, priority) {
        
        check([to, from, subject, text], [String]);

        this.unblock();

        console.log('sending email for task: ' + taskID);
        console.log('sending email at ' + (new Date(delivery)).toLocaleString());
    
        var now = (new Date).getTime(),
            delay = delivery - now;

        if (delay > 0) {

            console.log('delayed by: ' + delay);
            Meteor.setTimeout(function () {
                
                Email.send({
                        to: to,
                        from: from,
                        subject: subject,
                        text: text
                    });

                Tasks.update(taskID, {
                    $set: {
                        sent: true
                    }
                });

            }, delay);

            console.log('RETURN FALSE !!!');

            return false;

        } else {
                
            Email.send({
                    to: to,
                    from: from,
                    subject: subject,
                    text: text,
                    headers: {
                        'X-Priority': priority
                    }
                });

            return {
                to: to,
                from: from,
                subject: subject,
                text: text,
                taskID: taskID
            };

        }
        

    },

    updateSettings: function (field, name) {

        var settings = Settings.findOne({ user : Meteor.userId() });

        if (settings) {

            console.log('updating settings !!!');
            insertFriendIntoSettings(settings, name);

        } else {

            console.log('create settings');
            Settings.insert({
                user: Meteor.userId(),
                friends: [{ name: name }]
            });

        }

    }

});






Meteor.startup(function () {
    console.log('server started!');

    // Tasks.remove({});
    // Settings.remove({});

    // if (Tasks.find().count() === 0) {

    //     for (var i = 0; i < 3; i++) {
    //         Tasks.insert({
    //             name: 'active task ' + i,
    //             sent: false
    //         });
    //     }

    //     Tasks.insert({
    //         name: 'sent task',
    //         sent: true
    //     });
        
    // }

});

function insertFriendIntoSettings (settings, name) {

    var position = settings.friends.indexOf(settings.friends.filter(function (val) {
        return val.name.toLowerCase() === name.toLowerCase();
    })[0]);

    if (position < 0) {
        Settings.update({ user: Meteor.userId() }, {
            $push: {
                friends: { name: name }
            }
        });
    }

}

