import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/react-testing';
import RequestReset, {
  REQUEST_RESET_MUTATION,
} from '../components/RequestReset';

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: 'wesbos@gmail.com' },
    },
    result: {
      data: { requestReset: { message: 'success', __typename: 'Message' } },
    },
  },
];

describe('<RequestReset/>', () => {
  it('renders and matches snapshot', async () => {
    const { container } = render(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it.skip('calls the mutation', async () => {
    render(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );

    userEvent.type(screen.getByPlaceholderText('email'), 'wesbos@gmail.com');
    userEvent.click(screen.getByText(/Request Reset/i));
    const success = await screen.findByText(/Success/i);
    expect(success).toBeInTheDocument();
    // expect(wrapper.find('p').text()).toContain(
    //   'Success! Check your email for a reset link!'
    // );
  });
});
