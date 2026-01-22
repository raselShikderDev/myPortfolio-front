export interface IInputErrorState{
  success:boolean;
  errors:{
    feild:string;
    message:string;
  }[];
}

const getInputFeildError = (feildName:string, state:IInputErrorState) => {

  // biome-ignore lint/complexity/useOptionalChain: >
  if (state && state?.errors) {
    const error = state?.errors?.find((err)=> err.feild === feildName)
    return error ? error.message : null
  } else{
    return null
  }
 
}

export default getInputFeildError