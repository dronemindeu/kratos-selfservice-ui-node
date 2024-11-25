// Copyright © 2022 Ory Corp
// SPDX-License-Identifier: Apache-2.0
import { Session } from "@ory/client"
import {
  defaultConfig,
  requireAuth,
  RouteCreator,
  RouteRegistrator,
  setSession,
} from "../pkg"
import { navigationMenu } from "../pkg/ui"
import { CardGradient, Typography } from "@ory/elements-markup"

const autrikVideoShareURL = process.env.AUTRIK_VIDEO_SHARE_URL ?? "https://videoshare.autrik.com/"
const autrikAssetsURL = process.env.AUTRIK_ASSETS_URL ?? "https://autrik.com/api/public/assets/"
const autrikDocsURL = process.env.AUTRIK_DOCS_URL ?? "https://autrik.com/docs/"

const getConceptsByRole = () => {
  let concepts = [
    CardGradient({
      heading: "Video Streaming",
      content:
        "Share your device's Video Stream to the AutrikOS Dashboard.",
      action:
        autrikVideoShareURL,
      target: "_blank",
    }),
  ]
  concepts.push(
    CardGradient({
      heading: "Downloads",
      content:
        "Download the AutrikOS assets.",
      action:
        autrikAssetsURL,
      target: "_blank",
    }),
  )
  concepts.push(
    CardGradient({
      heading: "Documentation",
      content:
        "Read the AutrikOS documentation.",
      action:
        autrikDocsURL,
      target: "_blank",
    }),
  )
  return concepts
}

export const createWelcomeRoute: RouteCreator =
  (createHelpers) => async (req, res) => {
    res.locals.projectName = "Welcome to AutrikOS"

    const { frontend } = createHelpers(req, res)
    const session = req.session
    const { return_to } = req.query
    const activeSession = session === undefined ? false : true
    // Create a logout URL
    const concepts = getConceptsByRole()
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
      concepts: concepts,
    })
  }

export const registerWelcomeRoute: RouteRegistrator = (
  app,
  createHelpers = defaultConfig,
  route = "/welcome",
) => {
  app.get(route, requireAuth(createHelpers), createWelcomeRoute(createHelpers))
}
