import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import { IBot, ICreateBotDTo } from "../models/Bots/bots";
import "./BotContainer.scss";

import { } from "../";
import { LoadingSpinner } from "../components";
import { BotCard } from "../components/BotCard/BotCard";
import { ConfirmDialog } from "../components/ConfirmDialog/ConfirmDialog";
import { CreateEditBotComponent } from "../components/CreatebotComponent/CreateBotComponent";
import { useBotMutations } from "../hooks/useBots";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectBotsLoading } from "../store/selectors";
import { createBotAttempt, deleteBotByIdAttempt, updateBotAttempt } from "../store/slices/botSlice";

export const BotContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const botsMutation = useBotMutations();
  const { data: bots, isLoading, isError, error } = useBotMutations().botsQuery;
  const botsLoading = useAppSelector(selectBotsLoading);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState<{ open: boolean; bot: IBot | null }>({
    open: false,
    bot: null,
  });
  const [filter, setFilter] = useState<"all" | "online">("all");
  const [showConfirm, setShowConfirm] = useState<{ open: boolean; botId: string }>({
    open: false,
    botId: "",
  });

  const handleCreateBot = (bot: ICreateBotDTo) => {
    dispatch(createBotAttempt(bot));
    setShowCreateDialog(false);
  };

  const handleConnectBot = (bot: IBot) => {
    console.log("Connecting to bot:", bot);
  };

  const handleDeleteBot = (botId: string) => {
    dispatch(deleteBotByIdAttempt(botId));
    setShowConfirm({
      open: false,
      botId: "",
    });
  };

  const handleOnEdit = (bot: IBot) => {
    setShowEditDialog({
      open: true,
      bot,
    });
  };

  const handleSaveEdit = (id: string, bot: ICreateBotDTo) => {
    dispatch(updateBotAttempt({ id, bot }))
    setShowEditDialog({
      open: false,
      bot: null
    })
  };

  return (
    <div className="bot-container">
      <div className="bot-header">
        <div style={{ height: "6rem", width: "100%", display: "flex", justifyContent: "end" }} className="bot-controls">
          <Dropdown
            value={filter}
            options={[
              { label: "All Bots", value: "all" },
              { label: "Online Bots", value: "online" },
            ]}
            onChange={(e) => setFilter(e.value)}
            className="mr-3 border-primary border "
          />

          <Button label="Create Bot" icon="pi pi-plus" onClick={() => setShowCreateDialog(true)} />
        </div>
      </div>

      <div className="bot-grid">
        {bots && Array.isArray(bots) && bots.length > 0 && bots.map((bot) => {
          console.log(bots)
          return (
            <BotCard
              key={bot.id}
              onEdit={handleOnEdit}
              bot={bot}
              onConnect={handleConnectBot}
              onDelete={() => setShowConfirm({ botId: bot.id.toString(), open: true })}
            />
          );
        })}
      </div>

      <Dialog visible={showCreateDialog} onHide={() => setShowCreateDialog(false)} style={{ width: "100%", height: "100%" }}>
        <CreateEditBotComponent mode={"create"} onSubmit={handleCreateBot} />
      </Dialog>
      <Dialog
        onHide={() => setShowEditDialog({ open: false, bot: null })}
        visible={showEditDialog.open === true && showEditDialog.bot !== null ? true : false}
        style={{ width: "100%", height: "100%" }}
      >
        {showEditDialog.bot && (
          <CreateEditBotComponent mode="edit" bot={showEditDialog.bot} onSubmit={(bot, id) => handleSaveEdit(id, bot)} />
        )}
      </Dialog>

      {isLoading ? <LoadingSpinner overLay={true} /> : null}
      {showConfirm.open === true && showConfirm?.botId?.length ? (
        <ConfirmDialog
          onHide={() => setShowConfirm({ open: false, botId: "" })}
          Message="Are you sure you want to delete this bot"
          onConfirm={() => handleDeleteBot(showConfirm.botId)}
        />
      ) : null}
    </div>
  );
};
