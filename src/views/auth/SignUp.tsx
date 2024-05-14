import AuthInputField from '@components/form/AuthInputField';
import Form from '@components/form';
import colors from '@utils/colors';
import { FC, useState } from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as yup from 'yup';
import SubmitBtn from '@components/form/SubmitBtn';
import PasswordVisibilityIcon from '@ui/PasswordVisibilityIcon';
import AppLink from '@ui/AppLink';
import CircleUi from '@ui/CircleUi';
import AuthFormContainer from '@components/AuthFormContainer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from 'src/@types/navigation';
import { FormikHelpers } from 'formik';
import client from 'src/api/client';
import { useDispatch } from 'react-redux';
import { updateNotification } from 'src/store/notification';

const signupSchema = yup.object({
  name: yup.string().required('Name is required!').min(3, 'Name is too short!'),
  email: yup.string().required('Email is required!').email('Please enter a valid email address!'),
  password: yup.string()
    .required('Password is required!')
    .min(8, 'Password must be at least 8 characters long!')
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      'Password must include letters, numbers, and special characters!'
    ),
});

interface NewUser {
  name: string;
  email: string;
  password: string;
}

const initialValues: NewUser = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC = () => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();
  const dispatch = useDispatch();

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (values: NewUser, actions: FormikHelpers<NewUser>) => {
    actions.setSubmitting(true);
    try {
      const { data } = await client.post('/auth/create', values);
      navigation.navigate('Verification', { userInfo: data.user });
    } catch (error) {
      dispatch(updateNotification({ message: 'Failed to sign up, please try again.', type: 'error' }));
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={initialValues}
      validationSchema={signupSchema}>
      <AuthFormContainer 
        heading="     Welcome!"
        subHeading="     Let's get started by creating your account.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            placeholder="John Doe"
            label="Name"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="email"
            placeholder="john@email.com"
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            placeholder="********"
            label="Password"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            containerStyle={styles.marginBottom}
            rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePasswordView}
          />
          <SubmitBtn title="Sign up" />

          <View style={styles.linkContainer}>
            <AppLink
              title="I Lost My Password"
              onPress={() => navigation.navigate('LostPassword')}
            />
            <AppLink
              title="Sign in"
              onPress={() => navigation.navigate('SignIn')}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '90%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default SignUp;
