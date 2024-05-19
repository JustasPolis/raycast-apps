import { Action, ActionPanel, List } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { useMemo, useEffect } from "react";
import { userInfo } from "os";
import { execSync } from "child_process";

export default function Command() {
  const { isLoading, data } = useExec("mac-apps", ["list", "all"], {
    env: { USER: userInfo().username, PATH: "/opt/homebrew/bin" },
    shell: true,
  });
  const results = useMemo<{ id: string; name: string }[]>(() => JSON.parse(data || "{}") || [], [data]);

  return (
    <List>
      <List.Section title="Active">
        {results["active"] !== undefined &&
          results["active"].map((app, index) => (
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
                    }}
                  />
                </ActionPanel>
              }
            />
          ))}
      </List.Section>
      <List.Section title="Idle">
        {results["idle"] !== undefined &&
          results["idle"].map((app, index) => (
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
                    }}
                  />
                </ActionPanel>
              }
            />
          ))}
      </List.Section>
      <List.Section title="Inactive">
        {results["inactive"] !== undefined &&
          results["inactive"].map((app, index) => (
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
