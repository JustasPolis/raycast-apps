import { Action, ActionPanel, List, closeMainWindow, popToRoot } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { userInfo } from "os";
import { execSync } from "child_process";

export default function Command() {
  const { isLoading, data } = useExec("mac-apps", ["list", "all"], {
    env: { USER: userInfo().username, PATH: "/opt/homebrew/bin" },
    shell: true,
    parseOutput: ({ stdout }) => {
      return JSON.parse(stdout);
    },
    keepPreviousData: false,
  });

  const closeWindow = async () => await closeMainWindow({ clearRootSearch: true });

  if (isLoading)
    return (
      <List isLoading={isLoading}>
        <List.EmptyView />
      </List>
    );

  return (
    <List isLoading={isLoading}>
      <List.Section title="Active">
        {data !== undefined &&
          data["active"] !== undefined &&
          data["active"]
            // @ts-ignore
            .filter((app) => app.app !== "Raycast")
            // @ts-ignore
            .map((app, index) => (
              <List.Item
                key={index}
                title={app.title}
                id={app.id.toString()}
                icon={{ fileIcon: app.path }}
                subtitle={app.app}
                keywords={[app.app]}
                actions={
                  <ActionPanel>
                    <Action
                      title="Focus"
                      onAction={() => {
                        execSync(`/opt/homebrew/bin/yabai -m window --focus ${app.id}`, {
                          env: { USER: userInfo().username },
                        });
                        closeWindow();
                        popToRoot({ clearSearchBar: true });
                      }}
                    />
                  </ActionPanel>
                }
              />
            ))}
      </List.Section>
      <List.Section title="Idle">
        {data !== undefined &&
          data["idle"] !== undefined &&
          // @ts-ignore
          data["idle"].map((app, index) => (
            <List.Item
              key={index}
              title={app.title}
              id={app.id && app.id.toString()}
              icon={{ fileIcon: app.path }}
              subtitle={app.app}
              keywords={[app.app]}
              actions={
                <ActionPanel>
                  <Action
                    title="Open"
                    onAction={() => {
                      execSync(`open '${app.path}'`);
                      closeWindow();
                      popToRoot({ clearSearchBar: true });
                    }}
                  />
                </ActionPanel>
              }
            />
          ))}
      </List.Section>
      <List.Section title="Inactive">
        {data !== undefined &&
          data["inactive"] !== undefined &&
          // @ts-ignore
          data["inactive"].map((app, index) => (
            <List.Item
              key={index}
              title={app.title}
              id={app.id && app.id.toString()}
              icon={{ fileIcon: app.path }}
              subtitle={app.app}
              keywords={[app.app]}
              actions={
                <ActionPanel>
                  <Action
                    title="Open"
                    onAction={() => {
                      execSync(`open '${app.path}'`);
                      closeWindow();
                      popToRoot({ clearSearchBar: true });
                    }}
                  />
                </ActionPanel>
              }
            />
          ))}
      </List.Section>
    </List>
  );
}
