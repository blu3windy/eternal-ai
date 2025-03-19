package daos

import (
	"strings"

	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/errs"
	"github.com/eternalai-org/eternal-ai/agent-as-a-service/agent-orchestration/backend/models"
	"github.com/jinzhu/gorm"
)

func (d *DAO) FindAgentInfoJoinSelect(tx *gorm.DB, selected []string, joins map[string][]interface{}, filters map[string][]interface{}, preloads map[string][]interface{}, orders []string, page int, limit int) ([]*models.AgentInfo, error) {
	var ms []*models.AgentInfo
	err := d.findJoinSelect(tx, &models.AgentInfo{}, &ms, selected, joins, filters, preloads, orders, uint(page), uint(limit), false)
	if err != nil {
		return nil, errs.NewError(err)
	}
	return ms, nil
}

func (d *DAO) FirstAgentInfoJoinSelect(tx *gorm.DB, selected []string, joins map[string][]interface{}, filters map[string][]interface{}, preloads map[string][]interface{}, orders []string) (*models.AgentInfo, error) {
	var ms models.AgentInfo
	err := d.firstJoinSelect(tx, &ms, selected, joins, filters, preloads, orders, false)
	if err != nil {
		return nil, errs.NewError(err)
	}
	return &ms, nil
}

func (d *DAO) FirstAgentInfoByID(tx *gorm.DB, id uint, preloads map[string][]interface{}, forUpdate bool) (*models.AgentInfo, error) {
	var m models.AgentInfo
	if err := d.first(tx, &m, map[string][]interface{}{"id = ?": []interface{}{id}}, preloads, nil, forUpdate); err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &m, nil
}

func (d *DAO) FirstAgentInfo(tx *gorm.DB, filters map[string][]interface{}, preloads map[string][]interface{}, orders []string) (*models.AgentInfo, error) {
	var m models.AgentInfo
	if err := d.first(tx, &m, filters, preloads, orders, false); err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &m, nil
}

func (d *DAO) FindAgentInfo(tx *gorm.DB, filters map[string][]interface{}, preloads map[string][]interface{}, orders []string, offset int, limit int) ([]*models.AgentInfo, error) {
	var ms []*models.AgentInfo
	if err := d.find(tx, &ms, filters, preloads, orders, offset, limit, false); err != nil {
		return nil, err
	}
	return ms, nil
}

func (d *DAO) FindAgentInfo4Page(tx *gorm.DB, filters map[string][]interface{}, preloads map[string][]interface{}, orders []string, page int, limit int) ([]*models.AgentInfo, uint, error) {
	offset := (page - 1) * limit
	var ms []*models.AgentInfo
	if err := d.find(tx, &ms, filters, preloads, orders, offset, limit, false); err != nil {
		return nil, 0, errs.NewError(err)
	}
	c, err := d.count(tx, &models.AgentInfo{}, filters)
	if err != nil {
		return nil, 0, errs.NewError(err)
	}
	return ms, c, nil
}

func (d *DAO) FindAgentInfoJoin(tx *gorm.DB, joins map[string][]interface{}, filters map[string][]interface{}, preloads map[string][]interface{}, orders []string, page int, limit int) ([]*models.AgentInfo, error) {
	offset := (page - 1) * limit
	var ms []*models.AgentInfo
	err := d.findJoin(tx, &ms, joins, filters, preloads, orders, offset, limit, false)
	if err != nil {
		return nil, errs.NewError(err)
	}
	return ms, nil
}

func (d *DAO) AgentInfoGetReportDaily(tx *gorm.DB) (string, error) {
	var rs []*struct {
		Msg string
	}
	query := tx.Raw(`
select concat('agent created bitcoin : ', (
    select count(1)
    from agent_infos
    where agent_contract_id != ''
      and network_id = 222671
)) msg
union
select concat('agent created base : ',
              (select count(1)
               from agent_infos
               where agent_contract_id != ''
                 and network_id = 8453
              )
           )
union
select concat('agent running bitcoin : ', (
    select count(1)
    from agent_infos
    where agent_contract_id != ''
      and network_id = 222671
      and twitter_info_id > 0
      and (
            eai_balance > 0
            or eai_wallet_balance > 0
            or infer_latest_time is not null
        )
)
           )
union
select concat('agent running base : ', (
    select count(1)
    from agent_infos
    where agent_contract_id != ''
      and twitter_info_id > 0
      and network_id = 8453
      and (
            eai_balance > 0
            or eai_wallet_balance > 0
            or infer_latest_time is not null
        )
)
           )
union
select concat('eai topped up : ', (
    select sum(cast(amount as decimal(18, 2)))
    from agent_eai_topups
    where status = 'done'
      and deposit_address != ''
))
union
select concat('post num : ', (
    (select count(1)
     from agent_twitter_posts
     where reply_post_id != '')
)
           )
	`)

	if err := query.Scan(&rs).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return "", nil
		}
		return "", errs.NewError(err)
	}
	var msg string
	for _, v := range rs {
		msg = msg + v.Msg + "\n"
	}
	msg = strings.TrimSpace(msg)
	return msg, nil
}

// //
func (d *DAO) FirstAgentVideo(tx *gorm.DB, filters map[string][]interface{}, preloads map[string][]interface{}, orders []string) (*models.AgentVideo, error) {
	var m models.AgentVideo
	if err := d.first(tx, &m, filters, preloads, orders, false); err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &m, nil
}

func (d *DAO) FindAgentVideo(tx *gorm.DB, filters map[string][]interface{}, preloads map[string][]interface{}, orders []string, offset int, limit int) ([]*models.AgentVideo, error) {
	var ms []*models.AgentVideo
	if err := d.find(tx, &ms, filters, preloads, orders, offset, limit, false); err != nil {
		return nil, err
	}
	return ms, nil
}

func (d *DAO) FirstAgentVideoRecipient(tx *gorm.DB, filters map[string][]interface{}, preloads map[string][]interface{}, orders []string) (*models.AgentVideoRecipient, error) {
	var m models.AgentVideoRecipient
	if err := d.first(tx, &m, filters, preloads, orders, false); err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &m, nil
}

func (d *DAO) FirstClankerVideoToken(tx *gorm.DB, filters map[string][]interface{}, preloads map[string][]interface{}, orders []string) (*models.ClankerVideoToken, error) {
	var m models.ClankerVideoToken
	if err := d.first(tx, &m, filters, preloads, orders, false); err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &m, nil
}
