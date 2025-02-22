import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ThemeProvider } from '@material-ui/styles';
import {
  CssBaseline,
  Drawer,
  Box,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  Container,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton, ListItem,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import * as icons from '@material-ui/icons';
import Copyright from '../organisms/Copyright';
import { Page, Pages } from '../../pages';
import ControlPanelTemplateStyle from './ControlPanelTemplate.style';
import ControlPanelTemplateTheme from './ControlPanelTemplate.theme';

type Props = {
  children: React.ReactNode;
  page: Page;
};

const OptionKey = 'option/panel';

type Option = {
  isOpenSideBar?: boolean
}

const getLastOption = (): Option => {
  const optionJson = localStorage.getItem(OptionKey);
  const option: Option = optionJson ? JSON.parse(optionJson) : {};
  const isMobile = navigator.userAgent.match(/iPhone|Android.+Mobile/);
  if (option.isOpenSideBar === undefined) option.isOpenSideBar = !isMobile;
  return option;
};

const ControlPanelTemplate: React.FC<Props> = ({
  children,
  page,
}) => {
  const classes = ControlPanelTemplateStyle();
  const [option, setOption] = useState<Option>(getLastOption());

  useEffect(() => localStorage.setItem(OptionKey, JSON.stringify(option)), [option]);

  return (
    <ThemeProvider theme={ControlPanelTemplateTheme}>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, option.isOpenSideBar && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOption({ ...option, isOpenSideBar: true })}
              className={clsx(
                classes.menuButton,
                option.isOpenSideBar && classes.menuButtonHidden,
              )}
            >
              <icons.Menu />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              {page.name}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !option.isOpenSideBar && classes.drawerPaperClose),
          }}
          open={option.isOpenSideBar}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={() => setOption({ ...option, isOpenSideBar: false })}>
              <icons.ChevronLeft />
            </IconButton>
          </div>
          <Divider />
          <List>
            {Object.values(Pages).map((p) => (
              <Link to={p.href} className={classes.link} key={p.href}>
                <Tooltip title={p.name}>
                  <ListItem button>
                    <ListItemIcon>
                      {p.icon}
                    </ListItemIcon>
                    <ListItemText primary={p.name} />
                  </ListItem>
                </Tooltip>
              </Link>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {children}
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ControlPanelTemplate;
