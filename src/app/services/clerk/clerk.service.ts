import { Injectable } from '@angular/core';
import Clerk from '@clerk/clerk-js';
import environment from '../../../environments/environment.json';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ClerkService {
    Clerk?: Clerk;
    token?: string;

    isInitialized = false;

    constructor() {
        try {
            let clerk = window.Clerk;
            if (!clerk) {
                let clerk_key = environment.clerk;
                clerk = new Clerk(clerk_key);
            }
            this.Clerk = clerk;
            clerk.load()
                .then(() => {
                    if (this.Clerk && this.Clerk.session) {
                        this.Clerk.session.getToken().then((token) => {
                            this.token = token || undefined;
                            this.isInitialized = true;
                        });
                    }
                    return;
                }).catch((err) => {
                    console.error('Clerk: ', err);  
                    this.isInitialized = true;
                });
        } catch (err) {
            console.error('Clerk: ', err);
        }
    }

    tryGetToken() {
        if (!this.isInitialized || !this.token) {
            return;
        }   

        return this.token;
    }


    tryLogin() {
        if (!this.isInitialized || !this.Clerk) {
            return;
        }

        if (this.Clerk.user) {
            return this.Clerk.redirectToHome();
        }

        return this.Clerk.redirectToSignIn();
    }

}
