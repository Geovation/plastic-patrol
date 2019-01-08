import React from 'react';
import PageWrapper from '../../components/PageWrapper';
import { withStyles } from '@material-ui/core/styles';

const partner1 = process.env.PUBLIC_URL + '/custom/images/paddle_logger.svg';
const partner2 = process.env.PUBLIC_URL + '/custom/images/zerosixzero.png';

const styles = theme => ({
  images: {
    maxHeight:90,
    padding:10,
    alignSelf:'center'
  }
});

class PartnersPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <PageWrapper handleClickButton={this.props.handleClose} hasHeader={true}>
        <img className={classes.images} src={partner1} alt=''/>
        <img className={classes.images} src={partner2} alt=''/>
      </PageWrapper>
    );
  }
}

export default withStyles(styles)(PartnersPage);
