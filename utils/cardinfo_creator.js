export const getCardInfo = (card) => {
  const lore = card.lore ? `: ${card.lore.replace(/-{2,}/, '')}` : ''
  const types = card.types ? `[${card.types}]` : ''
  const legend = card.legend ? '❮LEGEND❯' : ''

  if (["Spell", "Trap"].includes(card.type)) {
    return `${card.name} ${legend} [${card.property} ${card.type}] ${lore}`
  } else if (card.type === "Skill") {
    return `${card.name} ${legend} ${types} ${lore}`
  } else if (["Monster", "Token"].includes(card.type)) {
    if (types.includes("Pendulum"))
      return `${card.name} ${legend} (${card.attribute}) [${card.level}⭐] [◀${card.scale}▶] ${types} [ATK/${card.atk} DEF/${card.def}] ${lore}`
    
    if (types.includes("Link"))
      return `${card.name} ${legend} (${card.attribute}) ${types} [ATK/${card.atk} LINK—${card.linkRating}] [${formatArrows(card.linkArrows)}] ${lore}`
      
    return `${card.name} ${legend} (${card.attribute}) [${card.level}⭐] ${types} [ATK/${card.atk} DEF/${card.def}] ${lore}`
  } else {
    return `${card.name} ${legend} ${lore}`
  }
}

const formatArrows = (array) => {
  const markers = {
    "Top-Left": '↖️',
    "Top-Center": '⬆️',
    "Top-Right": '↗️',
    "Middle-Left": '⬅️',
    "Bottom-Left": '↙️',
    "Bottom-Center": '⬇️',
    "Bottom-Right": '↘️',
    "Middle-Right": '➡️',
  }

  return array.map(arrow => markers[arrow.trim()]).join('')
}