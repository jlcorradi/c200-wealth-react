import React, { FC, FocusEvent, SyntheticEvent } from "react";
import { useWatchListContext } from "../store/WatchListStateProvider";
import QueryService from "../services/QueryService";
import WatchListService from "../services/WatchListService";
import OffCanva from "../template/OffCanva";
//@ts-ignore
import FormWithValidation from "./FormWithValidation";
import { required, ruleRunner } from "../Validatoion";
import { NumberHelper } from "../Helpers";
import { StockWatchListEntity } from "../types/stock";

const formConfig = {
  fields: [
    {
      field: "symbol",
      rowGroup: "stock",
      label: "Symbol",
      cssClass: "w100",
      onBlur: async (
        e: FocusEvent<HTMLInputElement>,
        onChange: (field: string, value: any) => void
      ) => {
        if (e.target.value.length < 4) {
          return;
        }

        const { data } = await QueryService.query<StockWatchListEntity>(
          "StockEntity",
          { symbol: e.target.value.toUpperCase() },
          "symbol"
        );

        if (data.content.length > 0) {
          onChange("description", data.content[0].description);
        }
      },
    },
    {
      field: "description",
      rowGroup: "stock",
      label: "Description",
      disabled: true,
    },
    { field: "lowerTarget", rowGroup: "target", label: "Lower Target" },
    {
      field: "upperTarget",
      rowGroup: "target",
      cssClass: "flex-1",
      label: "Upper Target",
    },
  ],
  validationRules: [
    ruleRunner("symbol", "Symbol", required),
    ruleRunner("lowerTarget", "lowerTarget", required),
    ruleRunner("upperTarget", "upperTarget", required),
  ],
};

// TODO: make validation Rules dynamic

function WatchListList() {
  const { state, actions } = useWatchListContext();
  const [instanceVisible, setInstanceVisible] = React.useState(false);
  const [itemToEdit, setItemToEdit] = React.useState<StockWatchListEntity>();

  return (
    <>
      <div className="padding lex flex-row">
        <div className="titlebar border-bottom">
          <div className="buttons">
            <a
              href="#add"
              onClick={(e) => {
                e.preventDefault();
                setItemToEdit({
                  lowerTarget: 0,
                  upperTarget: 0,
                  active: true,
                } as unknown as StockWatchListEntity);
                setInstanceVisible(true);
              }}
            >
              <i className="bx bx-add-to-queue"></i>
              <span>Add Alarm</span>
            </a>
          </div>
        </div>
        {state.watchListList.map((item, index) => (
          <WatchListItem
            item={item}
            key={index}
            onEditClick={(item: StockWatchListEntity) => {
              setInstanceVisible(true);
              setItemToEdit(item);
            }}
          />
        ))}
      </div>
      <OffCanva
        visible={instanceVisible}
        onDismiss={() => setInstanceVisible(false)}
      >
        <div className="titlebar">
          <h3>Alarm</h3>
        </div>
        <FormWithValidation
          modelToEdit={itemToEdit}
          config={formConfig}
          onDismiss={() => setInstanceVisible(false)}
          onSubmit={async (model: StockWatchListEntity) => {
            setInstanceVisible(false);
            await WatchListService.save(model);
            actions.reload();
          }}
        ></FormWithValidation>
      </OffCanva>
    </>
  );
}

const WatchListItem: FC<{
  item: StockWatchListEntity;
  onEditClick: (e: StockWatchListEntity) => void;
}> = ({ item, onEditClick }) => {
  const { state, actions } = useWatchListContext();
  return (
    <div className="flex flex-column">
      <div className="flex flex-row padding-v highlight-hover">
        <div
          className="flex flex-row align-items-center"
          style={{ width: "140px" }}
        >
          <img height={20} src={item.thumbImage} alt={item.symbol} />
        </div>
        <div className="flex flex-column padding-h">
          <small className="label">Stock</small>
          <div>{item.symbol}</div>
        </div>
        <div className="flex flex-column padding-h flex-1">
          <small className="label">Description</small>
          <div>{item.description}</div>
        </div>
        <div className="flex flex-column padding-h">
          <small className="label">Current Price</small>
          <div>{NumberHelper.formatBRL(item.currentPrice)}</div>
        </div>
        <div className="flex flex-column padding-h">
          <small className="label">Lower Target</small>
          <div>{NumberHelper.formatBRL(item.lowerTarget)}</div>
        </div>
        <div className="flex flex-column padding-h">
          <small className="label">Upper Target</small>
          <div>{NumberHelper.formatBRL(item.upperTarget)}</div>
        </div>
        <div className="flex flex-column padding-h">
          <small className="label">Active</small>
          <div>{item.active ? "Yes" : "No"}</div>
        </div>
        <div className="flex flex-column padding-h">
          <div className="buttons padding">
            <a
              href="#edit"
              className="info"
              onClick={(e) => {
                e.preventDefault();
                onEditClick(item);
              }}
            >
              <i className="bx bx-pencil"></i>
            </a>
            <a
              href="#delete"
              className="danger"
              onClick={async (e) => {
                e.preventDefault();
                if (!window.confirm("Delete alarm?")) {
                  return;
                }
                await WatchListService.delete(item.id ?? -1);
                actions.reload();
              }}
            >
              <i className="bx bx-trash"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchListList;
