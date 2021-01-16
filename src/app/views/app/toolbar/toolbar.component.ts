import { Component, OnDestroy, OnInit } from "@angular/core";
import { Colors } from "src/app/constants/colors.service";
import { ItemStatus, ItemType } from "src/app/models/enums";
import { DesignService } from "src/app/services/design.service";

@Component({
    selector: "app-toolbar",
    templateUrl: "./toolbar.component.html",
    styleUrls: ["./toolbar.component.scss"],
})
export class ToolbarComponent implements OnInit {
    constructor(public ds: DesignService) {}

    activeColor = Colors.getColors().separatorColor;
    ItemType = ItemType;
    ItemStatus = ItemStatus;

    ngOnInit(): void {}
}
