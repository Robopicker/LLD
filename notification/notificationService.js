// JavaScript version of the Notification System

/*============================
      Notification & Decorators
=============================*/

// Interface simulation using base class
class INotification {
    getContent() {
        throw new Error("Method 'getContent()' must be implemented.");
    }
}

// Concrete Notification: simple text notification.
class SimpleNotification extends INotification {
    constructor(msg) {
        super();
        this.text = msg;
    }

    getContent() {
        return this.text;
    }
}

// Abstract Decorator: wraps a Notification object.
class INotificationDecorator extends INotification {
    constructor(notification) {
        super();
        this.notification = notification;
    }
}

// Decorator to add a timestamp to the content.
class TimestampDecorator extends INotificationDecorator {
    constructor(notification) {
        super(notification);
    }

    getContent() {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
        return `[${now}] ${this.notification.getContent()}`;
    }
}

// Decorator to append a signature to the content.
class SignatureDecorator extends INotificationDecorator {
    constructor(notification, signature) {
        super(notification);
        this.signature = signature;
    }

    getContent() {
        return `${this.notification.getContent()}\n-- ${this.signature}\n\n`;
    }
}

/*============================
  Observer Pattern Components
=============================*/

// Observer interface
class IObserver {
    update() {
        throw new Error("Method 'update()' must be implemented.");
    }
}

// Observable interface
class IObservable {
    addObserver(observer) {
        throw new Error("Method 'addObserver()' must be implemented.");
    }

    removeObserver(observer) {
        throw new Error("Method 'removeObserver()' must be implemented.");
    }

    notifyObservers() {
        throw new Error("Method 'notifyObservers()' must be implemented.");
    }
}

// Concrete Observable
class NotificationObservable extends IObservable {
    constructor() {
        super();
        this.observers = [];
        this.currentNotification = null;
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers() {
        for (const observer of this.observers) {
            observer.update();
        }
    }

    setNotification(notification) {
        this.currentNotification = notification;
        this.notifyObservers();
    }

    getNotification() {
        return this.currentNotification;
    }

    getNotificationContent() {
        return this.currentNotification.getContent();
    }
}

/*============================
       NotificationService
=============================*/

// Singleton class
class NotificationService {
    static instance = null;

    constructor() {
        if (NotificationService.instance) {
            return NotificationService.instance;
        }
        this.observable = new NotificationObservable();
        this.notifications = [];
        NotificationService.instance = this;
    }

    static getInstance() {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Expose the observable so observers can attach.
    getObservable() {
        return this.observable;
    }

    // Creates a new Notification and notifies observers.
    sendNotification(notification) {
        this.notifications.push(notification);
        this.observable.setNotification(notification);
    }
}

/*============================
       ConcreteObservers
=============================*/

class Logger extends IObserver {
    constructor(observable = null) {
        super();
        this.notificationObservable = observable || NotificationService.getInstance().getObservable();
        this.notificationObservable.addObserver(this);
    }

    update() {
        console.log("Logging New Notification : \n" + this.notificationObservable.getNotificationContent());
    }
}

/*============================
  Strategy Pattern Components (Concrete Observer 2)
=============================*/

class INotificationStrategy {
    sendNotification(content) {
        throw new Error("Method 'sendNotification()' must be implemented.");
    }
}

class EmailStrategy extends INotificationStrategy {
    constructor(emailId) {
        super();
        this.emailId = emailId;
    }

    sendNotification(content) {
        // Simulate the process of sending an email notification
        console.log(`Sending email Notification to: ${this.emailId}\n${content}`);
    }
}

class SMSStrategy extends INotificationStrategy {
    constructor(mobileNumber) {
        super();
        this.mobileNumber = mobileNumber;
    }

    sendNotification(content) {
        // Simulate the process of sending an SMS notification
        console.log(`Sending SMS Notification to: ${this.mobileNumber}\n${content}`);
    }
}

class PopUpStrategy extends INotificationStrategy {
    sendNotification(content) {
        // Simulate the process of sending popup notification
        console.log(`Sending Popup Notification: \n${content}`);
    }
}

class NotificationEngine extends IObserver {
    constructor(observable = null) {
        super();
        this.notificationObservable = observable || NotificationService.getInstance().getObservable();
        this.notificationStrategies = [];
        if (!observable) {
            this.notificationObservable.addObserver(this);
        }
    }

    addNotificationStrategy(strategy) {
        this.notificationStrategies.push(strategy);
    }

    // Can have removeNotificationStrategy as well.

    update() {
        const notificationContent = this.notificationObservable.getNotificationContent();
        for (const strategy of this.notificationStrategies) {
            strategy.sendNotification(notificationContent);
        }
    }
}

/*============================
           Main
=============================*/

function main() {
    // Create NotificationService.
    const notificationService = NotificationService.getInstance();

    // Create Logger Observer
    const logger = new Logger();

    // Create NotificationEngine observers.
    const notificationEngine = new NotificationEngine();

    notificationEngine.addNotificationStrategy(new EmailStrategy("random.person@gmail.com"));
    notificationEngine.addNotificationStrategy(new SMSStrategy("+91 9876543210"));
    notificationEngine.addNotificationStrategy(new PopUpStrategy());

    let notification = new SimpleNotification("Your order has been shipped!");
    notification = new TimestampDecorator(notification);
    notification = new SignatureDecorator(notification, "Customer Care");

    notificationService.sendNotification(notification);
}

// Run main
main();

// Export classes for module usage
module.exports = {
    INotification,
    SimpleNotification,
    INotificationDecorator,
    TimestampDecorator,
    SignatureDecorator,
    IObserver,
    IObservable,
    NotificationObservable,
    NotificationService,
    Logger,
    INotificationStrategy,
    EmailStrategy,
    SMSStrategy,
    PopUpStrategy,
    NotificationEngine
};
