import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        return new Promise((resolve) => {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                this.router.navigate(['login']);
                resolve(false); // Pas de token d'accès, redirection vers login
                return;
            }

            const roleId = localStorage.getItem('id_role');
            const expectedRoles = route.data['expectedRoles'] as string[];

            console.log("from canActivate");
            console.log(roleId, expectedRoles);

            if (roleId && expectedRoles && expectedRoles.includes(roleId)) {
                resolve(true); // Le rôle de l'utilisateur est autorisé
            } else {
                this.router.navigate(['notfound']);
                resolve(false); // Le rôle de l'utilisateur n'est pas autorisé
            }
        });
    }
}
