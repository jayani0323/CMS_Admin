import {useState, useEffect} from "react";


function useForm(callback,validate,val,url,method,callbackIsSubmitting){

    //Hook to store states of values
    const [values,setValues] = useState({
       ...val
    });
    //Hook to store errors
    const [errors,setErrors] = useState({});
    //Hook to store submitting status
    const [isSubmitting,setIsSubmitting] = useState(false);

    //This function executes on onChange event of the input box
    const handleChange = e=>{
        const {name,value} = e.target;
        setValues({...values,[name]:value});
    };

    const handleFileSubmit = ({file},name)=>{
        setValues({...values,[name]:file});
    }

    //This function is executed on form submission
    const handleSubmit = e=> {
        e.preventDefault();
        //Sets errors if there are errors
        setErrors(validate(values));
        setIsSubmitting(true);
        console.log(errors);
    }

    useEffect(
        ()=>{
            //Checks if there are no errors and the form is in IsSubmitting state
            if(Object.keys(errors).length === 0 && isSubmitting ){

                // //Submit the form
                if(url){
                    callbackIsSubmitting();
                    submitForm();
                }else{
                    //Callback the submitForm method
                    callback(values);
                }

            }
        },[errors]
    );

    //This function handles the POST api call to submit the form data
    const submitForm = () =>{


            fetch(url,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method:"POST",
                body: JSON.stringify(values)
            }).then(res => res.json())
                .then(data=>callback(data))
                .catch(err=>console.log(err));
    }


    return {handleChange,handleSubmit,values,errors,handleFileSubmit};

}
export default useForm;