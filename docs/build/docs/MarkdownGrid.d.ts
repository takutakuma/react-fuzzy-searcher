import * as React from "react";
import { Theme, WithStyles } from "@material-ui/core/styles";
declare const styles: (theme: Theme) => Record<"root" | "content" | "button" | "sidebar" | "contentContainer", import("@material-ui/core/styles/withStyles").CSSProperties>;
export interface IMarkdownGridSection {
    title: string;
    content: string;
}
export interface IMarkdownGridProps extends WithStyles<typeof styles> {
    sections: IMarkdownGridSection[];
}
declare const _default: React.ComponentType<Pick<IMarkdownGridProps, "sections"> & import("@material-ui/core").StyledComponentProps<"root" | "content" | "button" | "sidebar" | "contentContainer">>;
export default _default;