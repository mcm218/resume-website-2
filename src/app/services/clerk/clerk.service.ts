import { Injectable } from '@angular/core';
import Clerk from '@clerk/clerk-js';

@Injectable({
    providedIn: 'root',
})
export class ClerkService {
    Clerk?: Clerk;

    constructor() {
        try {
            let clerk = window.Clerk;
            if (!clerk) {
                let clerk_key = 'pk_test_cHJlc2VudC10YWhyLTE2LmNsZXJrLmFjY291bnRzLmRldiQ';
                clerk = new Clerk(clerk_key);
            }
           this.init(clerk);

        } catch (err) {
            console.error('Clerk: ', err);
        }
    }

    async getClerk() {
        if (!this.Clerk) {
            let clerk_key = 'pk_test_cHJlc2VudC10YWhyLTE2LmNsZXJrLmFjY291bnRzLmRldiQ';
            this.Clerk = new Clerk(clerk_key);
            await this.init(this.Clerk);
        }
        return this.Clerk;
    }

    async init (clerk: Clerk) {
        try {
            // Load Clerk environment & session if available
            await clerk.load();
            if (!clerk.user) {
                clerk.redirectToSignIn();
                return;
            }

            clerk.redirectToHome();
        } catch (err) {
            console.error('Clerk: ', err);
        }
    }
}
