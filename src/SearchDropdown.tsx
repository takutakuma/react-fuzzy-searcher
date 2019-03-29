import * as React from 'react';
import {
  withStyles,
  Theme,
  createStyles,
  WithStyles
} from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Divider,
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { List, AutoSizer } from 'react-virtualized';
import SearchResult, { ISearchResultOptions } from './SearchResult';
var colors = require('./Common.scss');

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      zIndex: 2147483647
    },
    dropdownContainer: {
      marginTop: '10px',
      border: `1px solid ${colors.placeholderGray}`
      // boxShadow: "0 0 0 100vmax rgba(0,0,0,.3)"
    },
    grow: {
      maxHeight: '500px',
      overflowY: 'auto'
    },
    menuItem: {
      height: 'auto'
    },
    noResultsText: {
      textAlign: 'center'
    }
  });

export interface ISearchDropdownProps extends WithStyles<typeof styles> {
  showDropdown: boolean;
  anchorEl: HTMLDivElement | null;
  handleDropdownClose(event: any): void;
  data: any;
  maxDropdownHeight: string;
  searchResultOptions?: ISearchResultOptions;
}

interface ISearchDropdownState {}

class SearchDropdown extends React.Component<
  ISearchDropdownProps,
  ISearchDropdownState
> {
  render() {
    const { classes } = this.props;

    return (
      <Popper
        open={this.props.showDropdown}
        anchorEl={this.props.anchorEl}
        transition
        disablePortal
        modifiers={{
          flip: {
            behavior: ['bottom']
          }
        }}
        className={classes.root}
        placement={'bottom'}
        style={{
          width:
            (this.props.anchorEl && this.props.anchorEl.clientWidth) || '100%'
        }}
      >
        {({ TransitionProps: TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
              maxHeight: this.props.maxDropdownHeight,
              overflowY: 'auto'
            }}
          >
            <Paper className={classes.dropdownContainer}>
              <ClickAwayListener onClickAway={this.props.handleDropdownClose}>
                {this.renderDropdownMenuItems()}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  }

  renderDropdownMenuItems = () => {
    const { classes } = this.props;

    if (this.props.data.length === 0) {
      // render zero data
      return (
        <MenuList dense={false} style={{ padding: 0, borderWidth: '3px' }}>
          <MenuItem
            disabled={true}
            classes={{
              root: classes.noResultsText
            }}
          >
            <Typography component="p">No results found</Typography>
          </MenuItem>
        </MenuList>
      );
    }
    return (
      <MenuList
        dense={false}
        style={{
          padding: 0,
          borderWidth: '3px',
          height: this.props.data.length * 100
        }}
      >
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              rowHeight={100}
              autoHeight={true}
              rowCount={this.props.data.length}
              rowRenderer={this._rowRenderer}
            />
          )}
        </AutoSizer>
      </MenuList>
    );
  };

  _rowRenderer = ({ index, key }: { index: number; key: any }) => {
    return (
      <div>
        <MenuItem
          onClick={(event: any) =>
            this.handleMenuItemClick(this.props.data[index], key, event)
          }
          classes={{
            root: this.props.classes.menuItem
          }}
        >
          {this.renderSearchResult(this.props.data[index])}
        </MenuItem>
        <Divider />
      </div>
    );
  };

  renderMenuItemWithoutLink = (fuseResult: any, idx: number) => {
    const { classes } = this.props;

    return (
      <MenuItem
        onClick={(event: any) =>
          this.handleMenuItemClick(fuseResult, idx, event)
        }
        classes={{
          root: classes.menuItem
        }}
      >
        {this.renderSearchResult(fuseResult)}
      </MenuItem>
    );
  };

  renderMenuItemWithLink = (fuseResult: any, idx: number) => {
    const { classes } = this.props;

    return (
      <MenuItem
        onClick={(event: any) => this.props.handleDropdownClose(event)}
        classes={{
          root: classes.menuItem
        }}
        component={({ innerRef, ...props }) => (
          <Link {...props} to={fuseResult.item.onClick} />
        )}
      >
        {this.renderSearchResult(fuseResult)}
      </MenuItem>
    );
  };

  renderSearchResult(fuseResult: any) {
    if (fuseResult.item.onRender) {
      return fuseResult.item.onRender(fuseResult);
    }
    return (
      <SearchResult
        fuseResult={fuseResult}
        searchResultOptions={this.props.searchResultOptions}
      />
    );
  }

  handleMenuItemClick = (d: any, idx: number, event: any) => {
    if (d.item.onClick) {
      d.item.onClick();
    }
    this.props.handleDropdownClose(event);
  };
}

export default withStyles(styles)(SearchDropdown);
