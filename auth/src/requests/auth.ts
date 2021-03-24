export interface RequestSignUpJWT {
   email: string,
   username: string,
   password: string,
   passwordConfirm: string
}

export interface RequestSignInJWT {
   password: string,
   usernameOrEmail: string,
}

export interface RequestSignInGoogle {
   password: string,
   usernameOrEmail: string,
}