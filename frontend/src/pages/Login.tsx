import { ErrorMessage, Field, Formik } from 'formik'
import { Button } from 'primereact/button' 
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useLoginUserMutation } from '../provider/queries/Auth.query'
import { toast } from 'sonner'

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

interface LoginError {
  data?: {
    message: string;
  };
  status?: number;
}

const Login = () => {
  const [loginUser, loginUserResponse] = useLoginUserMutation()
  const navigate = useNavigate()

  const initialValues: LoginCredentials = {
    email: '',
    password: ''
  }

  const validationSchema = yup.object({
    email: yup.string().email("Email must be valid").required("Email is required"),
    password: yup.string().min(5, "Password must be greater than 5 characters").required("Password is required"),
  })

  const onSubmitHandler = async (
    values: LoginCredentials, 
    { resetForm }: { resetForm: () => void }
  ) => {
    try {
      const { data, error } = await loginUser(values) as { 
        data?: LoginResponse; 
        error?: LoginError 
      }

      if (error) {
        toast.error(error.data?.message || 'Login failed');
        return
      }

      if (data?.token) {
        localStorage.setItem("token", data.token);
        resetForm()
        navigate("/")
        toast.success('Login successful!')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error?.message || 'An unexpected error occurred');
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center w-full bg-[#eee]'>
      <Formik 
        initialValues={initialValues} 
        validationSchema={validationSchema} 
        onSubmit={onSubmitHandler}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="w-[96%] md:w-[70%] lg:w-1/3 shadow-md rounded-md pt-10 pb-3 px-4 bg-white">
            <div className="mb-3 py-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Field 
                id='email' 
                name='email' 
                type='email'
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg' 
                placeholder='Enter Email Address' 
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm mt-1' name='email' />
            </div>
            
            <div className="mb-3 py-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Field 
                name='password' 
                id='password' 
                type='password'
                className='w-full outline-none py-3 px-2 border-[.1px] border-zinc-400 rounded-lg' 
                placeholder='*****' 
              />
              <ErrorMessage component={'p'} className='text-red-500 text-sm mt-1' name='password' />
            </div>
            
            <div className="mb-3 py-1 flex items-center justify-center">
              <Button 
                type="submit"
                disabled={loginUserResponse.isLoading || isSubmitting}
                loading={loginUserResponse.isLoading} 
                className='w-full bg-red-500 text-white py-3 px-2 flex items-center justify-center hover:bg-red-600 transition-colors'
              >
                Submit
              </Button>
            </div>
            
            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1 text-sm">
                Don't Have An Account?
                <Link className='font-semibold text-blue-600 hover:text-blue-800' to={'/register'}>
                  Register
                </Link>
              </p>
            </div>
            
            <div className="mb-3 py-1 flex items-center justify-end">
              <p className="inline-flex items-center gap-x-1 text-sm">
                Forget
                <Link className='font-semibold text-blue-600 hover:text-blue-800' to={'/forgot-password'}>
                  Password ?
                </Link>
              </p>
            </div>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default Login