from x_content.tasks.utils import a_move_state
from x_content.tasks.base import ChatTaskBase
from x_content.models import ChatRequest, ReasoningLog
from x_content.models import ReasoningLog, MissionChainState
from x_content.services import chat_service


class ChatV2(ChatTaskBase):
    resumable = True

    async def process_task(self, request: ChatRequest) -> ReasoningLog:
        if request.state == MissionChainState.NEW:
            request.chat_result = await chat_service.get_chat(
                request, self.llm, self.kn_base
            )

            return await a_move_state(
                request, MissionChainState.DONE, "Task completed"
            )

        return request
