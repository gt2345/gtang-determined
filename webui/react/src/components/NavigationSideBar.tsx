import { Button, Menu, MenuProps, Tooltip, Typography } from 'antd';
import { boolean } from 'io-ts';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import Dropdown, { Placement } from 'components/Dropdown';
import DynamicIcon from 'components/DynamicIcon';
import Link, { Props as LinkProps } from 'components/Link';
import AvatarCard from 'components/UserAvatarCard';
import useModalJupyterLab from 'hooks/useModal/JupyterLab/useModalJupyterLab';
import useModalWorkspaceCreate from 'hooks/useModal/Workspace/useModalWorkspaceCreate';
import usePermissions from 'hooks/usePermissions';
import { SettingsConfig, useSettings } from 'hooks/useSettings';
import { clusterStatusText } from 'pages/Clusters/ClustersOverview';
import WorkspaceQuickSearch from 'pages/WorkspaceDetails/WorkspaceQuickSearch';
import WorkspaceActionDropdown from 'pages/WorkspaceList/WorkspaceActionDropdown';
import { paths } from 'routes/utils';
import Icon from 'shared/components/Icon/Icon';
import Spinner from 'shared/components/Spinner/Spinner';
import useUI from 'shared/contexts/stores/UI';
import { useAgents, useClusterOverview } from 'stores/agents';
import { useAuth } from 'stores/auth';
import { initInfo, useDeterminedInfo } from 'stores/determinedInfo';
import { useResourcePools } from 'stores/resourcePools';
import { useWorkspaces } from 'stores/workspaces';
import { BrandingType } from 'types';
import { Loadable } from 'utils/loadable';

import css from './NavigationSideBar.module.scss';
import ThemeToggle from './ThemeToggle';

interface ItemProps extends LinkProps {
  action?: React.ReactNode;
  badge?: number;
  icon: string | React.ReactNode;
  label: string;
  labelRender?: React.ReactNode;
  status?: string;
  tooltip?: boolean;
}

interface Settings {
  navbarCollapsed: boolean;
}

const settingsConfig: SettingsConfig<Settings> = {
  applicableRoutespace: 'navigation',
  settings: {
    navbarCollapsed: {
      defaultValue: false,
      skipUrlEncoding: true,
      storageKey: 'navbarCollapsed',
      type: boolean,
    },
  },
  storagePath: 'navigation',
};

export const NavigationItem: React.FC<ItemProps> = ({
  path,
  status,
  action,
  ...props
}: ItemProps) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const classes = [css.navItem];
  const containerClasses = [css.navItemContainer];

  if (isActive) {
    containerClasses.push(css.active);
    classes.push(css.active);
  }
  if (status) containerClasses.push(css.hasStatus);

  useEffect(() => {
    setIsActive(location.pathname === path);
  }, [location.pathname, path]);

  const link = (
    <div className={containerClasses.join(' ')}>
      <Link className={classes.join(' ')} path={path} {...props}>
        {typeof props.icon === 'string' ? (
          <div className={css.icon}>
            <Icon name={props.icon} size="large" />
          </div>
        ) : (
          <div className={css.icon}>{props.icon}</div>
        )}
        <div className={css.label}>{props.labelRender ? props.labelRender : props.label}</div>
      </Link>
      <div className={css.navItemExtra}>
        {status && (
          <Link path={path} {...props}>
            <div className={css.status}>{status}</div>
          </Link>
        )}
        {action && <div className={css.action}>{action}</div>}
      </div>
    </div>
  );

  return props.tooltip ? (
    <Tooltip placement="right" title={props.label}>
      <div>{link}</div>
    </Tooltip>
  ) : (
    link
  );
};

const NavigationSideBar: React.FC = () => {
  // `nodeRef` padding is required for CSSTransition to work with React.StrictMode.
  const nodeRef = useRef(null);

  const loadableAuth = useAuth();
  const isAuthenticated = Loadable.match(loadableAuth.auth, {
    Loaded: (auth) => auth.isAuthenticated,
    NotLoaded: () => false,
  });
  const authUser = Loadable.match(loadableAuth.auth, {
    Loaded: (auth) => auth.user,
    NotLoaded: () => undefined,
  });
  const loadableResourcePools = useResourcePools();
  const resourcePools = Loadable.getOrElse([], loadableResourcePools); // TODO show spinner when this is loading
  const info = Loadable.getOrElse(initInfo, useDeterminedInfo());
  const { ui } = useUI();
  const agents = useAgents();
  const overview = useClusterOverview();
  const clusterStatus = Loadable.match(Loadable.all([agents, overview]), {
    Loaded: ([agents, overview]) => clusterStatusText(overview, resourcePools, agents),
    NotLoaded: () => undefined, // TODO show spinner when this is loading
  });

  const { settings, updateSettings } = useSettings<Settings>(settingsConfig);
  const { contextHolder: modalJupyterLabContextHolder, modalOpen: openJupyterLabModal } =
    useModalJupyterLab();
  const { contextHolder: modalWorkspaceCreateContextHolder, modalOpen: openWorkspaceCreateModal } =
    useModalWorkspaceCreate();
  const showNavigation = isAuthenticated && ui.showChrome;
  const version = process.env.VERSION || '';
  const shortVersion = version.replace(/^(\d+\.\d+\.\d+).*?$/i, '$1');
  const isVersionLong = version !== shortVersion;

  const { canCreateWorkspace, canViewWorkspace, canEditWebhooks } = usePermissions();

  const canAccessUncategorized = canViewWorkspace({ workspace: { id: 1 } });

  const menuConfig = useMemo(() => {
    const topNav = canAccessUncategorized
      ? [{ icon: 'experiment', label: 'Uncategorized', path: paths.uncategorized() }]
      : [];
    const topItems = [
      ...topNav,
      { icon: 'model', label: 'Model Registry', path: paths.modelList() },
      { icon: 'tasks', label: 'Tasks', path: paths.taskList() },
      { icon: 'cluster', label: 'Cluster', path: paths.cluster() },
    ];
    if (canEditWebhooks) {
      topItems.splice(topItems.length - 1, 0, {
        icon: 'webhooks',
        label: 'Webhooks',
        path: paths.webhooks(),
      });
    }
    return {
      bottom: [
        { external: true, icon: 'docs', label: 'Docs', path: paths.docs(), popout: true },
        {
          external: true,
          icon: 'cloud',
          label: 'API (Beta)',
          path: paths.docs('/rest-api/'),
          popout: true,
        },
        {
          external: true,
          icon: 'pencil',
          label: 'Feedback',
          path: paths.submitProductFeedback(info.branding || BrandingType.Determined),
          popout: true,
        },
      ],
      top: topItems,
    };
  }, [canAccessUncategorized, canEditWebhooks, info.branding]);

  const handleCollapse = useCallback(() => {
    updateSettings({ navbarCollapsed: !settings.navbarCollapsed });
  }, [settings.navbarCollapsed, updateSettings]);

  const handleCreateWorkspace = useCallback(() => {
    openWorkspaceCreateModal();
  }, [openWorkspaceCreateModal]);

  const pinnedWorkspaces = useWorkspaces({ pinned: true });
  const { canAdministrateUsers } = usePermissions();

  const menuItems: MenuProps['items'] = useMemo(() => {
    const items = [
      {
        key: 'settings',
        label: <Link path={paths.settings('account')}>Settings</Link>,
      },
      { key: 'theme-toggle', label: <ThemeToggle /> },
      { key: 'sign-out', label: <Link path={paths.logout()}>Sign Out</Link> },
    ];
    if (canAdministrateUsers) {
      items.unshift({
        key: 'admin',
        label: <Link path={paths.admin()}>Admin</Link>,
      });
    }
    return items;
  }, [canAdministrateUsers]);

  if (!showNavigation) return null;

  return (
    <CSSTransition
      appear={true}
      classNames={{
        appear: css.collapsedAppear,
        appearActive: settings.navbarCollapsed ? css.collapsedEnterActive : css.collapsedExitActive,
        appearDone: settings.navbarCollapsed ? css.collapsedEnterDone : css.collapsedExitDone,
        enter: css.collapsedEnter,
        enterActive: css.collapsedEnterActive,
        enterDone: css.collapsedEnterDone,
        exit: css.collapsedExit,
        exitActive: css.collapsedExitActive,
        exitDone: css.collapsedExitDone,
      }}
      in={settings.navbarCollapsed}
      nodeRef={nodeRef}
      timeout={200}>
      <nav className={css.base} ref={nodeRef}>
        <header>
          <Dropdown
            content={<Menu items={menuItems} selectable={false} />}
            offset={settings.navbarCollapsed ? { x: -8, y: 16 } : { x: 16, y: -8 }}
            placement={settings.navbarCollapsed ? Placement.RightTop : Placement.BottomLeft}>
            <AvatarCard className={css.user} darkLight={ui.darkLight} user={authUser} />
          </Dropdown>
        </header>
        <main>
          <section className={css.launch}>
            <div className={css.launchBlock}>
              <Button className={css.launchButton} onClick={() => openJupyterLabModal()}>
                Launch JupyterLab
              </Button>
              {settings.navbarCollapsed ? (
                <Button className={css.launchIcon} onClick={() => openJupyterLabModal()}>
                  <Icon name="jupyter-lab" />
                </Button>
              ) : null}
            </div>
          </section>
          <section className={css.top}>
            {menuConfig.top.map((config) => (
              <NavigationItem
                key={config.icon}
                status={config.icon === 'cluster' ? clusterStatus : undefined}
                tooltip={settings.navbarCollapsed}
                {...config}
              />
            ))}
          </section>
          <section className={css.workspaces}>
            <NavigationItem
              action={
                <div className={css.actionButtons}>
                  <WorkspaceQuickSearch>
                    <Button type="text">
                      <Icon name="search" size="tiny" />
                    </Button>
                  </WorkspaceQuickSearch>
                  {canCreateWorkspace ? (
                    <Button type="text" onClick={handleCreateWorkspace}>
                      <Icon name="add-small" size="tiny" />
                    </Button>
                  ) : null}
                </div>
              }
              icon="workspaces"
              key="workspaces"
              label="Workspaces"
              path={paths.workspaceList()}
              tooltip={settings.navbarCollapsed}
            />
            {Loadable.match(pinnedWorkspaces, {
              Loaded: (workspaces) =>
                workspaces.length === 0 ? (
                  <p className={css.noWorkspaces}>No pinned workspaces</p>
                ) : (
                  <ul className={css.pinnedWorkspaces} role="list">
                    {workspaces.map((workspace) => (
                      <WorkspaceActionDropdown
                        key={workspace.id}
                        trigger={['contextMenu']}
                        workspace={workspace}>
                        <li>
                          <NavigationItem
                            icon={<DynamicIcon name={workspace.name} size={24} />}
                            label={workspace.name}
                            labelRender={
                              <Typography.Paragraph ellipsis={{ rows: 1, tooltip: true }}>
                                {workspace.name}
                              </Typography.Paragraph>
                            }
                            path={paths.workspaceDetails(workspace.id)}
                          />
                        </li>
                      </WorkspaceActionDropdown>
                    ))}
                  </ul>
                ),
              NotLoaded: () => <Spinner />,
            })}
          </section>
          <section className={css.bottom}>
            {menuConfig.bottom.map((config) => (
              <NavigationItem key={config.icon} tooltip={settings.navbarCollapsed} {...config} />
            ))}
            <NavigationItem
              icon={settings.navbarCollapsed ? 'expand' : 'collapse'}
              label={settings.navbarCollapsed ? 'Expand' : 'Collapse'}
              tooltip={settings.navbarCollapsed}
              onClick={handleCollapse}
            />
          </section>
        </main>
        <footer>
          <div className={css.version}>
            {isVersionLong && settings.navbarCollapsed ? (
              <Tooltip placement="right" title={`Version ${version}`}>
                <span className={css.versionLabel}>{shortVersion}</span>
              </Tooltip>
            ) : (
              <span className={css.versionLabel}>{version}</span>
            )}
          </div>
        </footer>
        {modalJupyterLabContextHolder}
        {modalWorkspaceCreateContextHolder}
      </nav>
    </CSSTransition>
  );
};

export default NavigationSideBar;
