
import { createMuiTheme } from '@material-ui/core/styles';
import { green, orange } from '@material-ui/core/colors';

const theme = createMuiTheme({
  palette: {
    primary: orange,
    secondary: green,
  },
  status: {
    danger: 'yellow',
  },
});
export default theme
