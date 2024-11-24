// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import {
  defaultConfig,
  RouteCreator,
  RouteRegistrator,
  setSession,
} from "../pkg"
import { navigationMenu } from "../pkg/ui"
import { CardGradient, Typography } from "@ory/elements-markup"

export const createWelcomeRoute: RouteCreator =
  (createHelpers) => async (req, res) => {
    res.locals.projectName = "Welcome to AutrikOS"

    const { frontend } = createHelpers(req, res)
    const session = req.session
    const { return_to } = req.query

    // Create a logout URL
    const logoutUrl =
      (
        await frontend
          .createBrowserLogoutFlow({
            cookie: req.header("cookie"),
            returnTo: (return_to && return_to.toString()) || "",
          })
          .catch(() => ({ data: { logout_url: "" } }))
      ).data.logout_url || ""

    res.render("welcome", {
      layout: "welcome",
      nav: navigationMenu({
        navTitle: res.locals.projectName,
        session,
        logoutUrl,
        selectedLink: "welcome",
      }),
      projectInfoText: Typography({
        children: `You are on the AutrikOS platform.`,
        type: "regular",
        size: "small",
        color: "foregroundMuted",
      }),
      concepts: [
        // CardGradient({
        //   heading: "Data Visualisation",
        //   content:
        //     "Browse through all point clouds uploaded on the server.",
        //   action:
        //     "https://autrik.com/api/data/",
        //   target: "_blank",
        // }),
        CardGradient({
          heading: "Video Streaming",
          content:
            "Share your device's Video Stream to the AutrikOS Dashboard.",
          action:
            "https://videoshare.autrik.com/",
          target: "_blank",
        }),
        // CardGradient({
        //   heading: "User flows",
        //   content:
        //     "Implement flows that users perform themselves as opposed to administrative intervention.",
        //   action: "https://www.ory.sh/docs/kratos/self-service",
        //   target: "_blank",
        // }),
        // CardGradient({
        //   heading: "Identities 101",
        //   content:
        //     "Every identity can have its own model - get to know the ins and outs of Identity Schemas.",
        //   action:
        //     "https://www.ory.sh/docs/kratos/manage-identities/identity-schema",
        //   target: "_blank",
        // }),
        // CardGradient({
        //   heading: "Sessions",
        //   content:
        //     "Ory Network manages sessions for you - get to know how sessions work.",
        //   action: "https://www.ory.sh/docs/kratos/session-management/overview",
        //   target: "_blank",
        // }),
        // CardGradient({
        //   heading: "Custom UI",
        //   content:
        //     "Implementing these pages in your language and framework of choice is straightforward using our SDKs.",
        //   action:
        //     "https://www.ory.sh/docs/kratos/bring-your-own-ui/configure-ory-to-use-your-ui",
        //   target: "_blank",
        // }),
      ].join("\n"),
    })
  }

export const registerWelcomeRoute: RouteRegistrator = (
  app,
  createHelpers = defaultConfig,
  route = "/welcome",
) => {
  app.get(route, setSession(createHelpers), createWelcomeRoute(createHelpers))
}
