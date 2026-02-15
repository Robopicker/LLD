interface PaymentMethod {
    pay(amount: number): void;
}
class CardPayment implements PaymentMethod {
    pay(amount: number): void {
       console.log("you are paying through Card Payment"); 
    }

}
class UpiPayment implements PaymentMethod {
    pay(amount: number): void {
        console.log("you are paying using upi payment");
    }
}

class PaymentProcessor {
    constructor(private paymentMethod: PaymentMethod) {}
    process(amount: number) {
        this.paymentMethod.pay(amount)
    }
}

