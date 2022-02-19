import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { useDragControls, usePresence } from 'framer-motion';

import { Menu } from '@styled-icons/feather';

import { events } from '@events/base';
import { GroupFields } from 'components';

import { getSocialImgUrl } from 'utils';
import { variants, animations } from './animations';

import { groups } from './fields';
import * as S from './styles';

type TechIconVariantsProps = {
  tech: string;
  icon: string;
  short_name?: string;
  refs: EditSocialItemRef[];
};

export type EditSocialItemRef = {
  closeEditForm: () => void;
};

const EditSocialItem: React.ForwardRefRenderFunction<
  EditSocialItemRef,
  TechIconVariantsProps
> = ({ tech, icon, short_name, refs = [] }, ref) => {
  const dragControls = useDragControls();
  const [isPresent, safeToRemove] = usePresence();

  const [isOpenEditForm, setIsOpenEditForm] = useState(false);

  const handleToggleEditForm = () => {
    if (!isOpenEditForm) handleCloseAllEditForms();

    setIsOpenEditForm(!isOpenEditForm);
  };

  const handleDeleteTech = () => {
    const path = `content.socials.${tech}`;

    events.canvas.edit({ path, value: undefined });
  };

  const handleCloseEditForm = () => setIsOpenEditForm(false);

  const handleCloseAllEditForms = () =>
    refs.forEach(item => item?.closeEditForm());

  useImperativeHandle(
    ref,
    () => ({
      closeEditForm: handleCloseEditForm,
    }),
    []
  );

  useEffect(() => {
    !isPresent && setTimeout(safeToRemove!, 1000);
  }, [isPresent]);

  return (
    <S.Container
      value={tech}
      variants={variants.container}
      dragListener={false}
      dragControls={dragControls}
      layout
      {...animations.container}
    >
      <S.Content>
        <S.Drag
          onPointerDown={event => [
            handleCloseAllEditForms(),
            dragControls.start(event),
          ]}
        >
          <Menu />
        </S.Drag>

        <S.Logo
          key={`${tech} ${icon}`}
          alt={`${tech} ${icon} logo`}
          src={getSocialImgUrl('icon', tech, { icon })}
        />

        <S.Wrapper>
          <S.Name>{short_name || tech}</S.Name>

          <S.DeleteIcon size={16} onClick={handleDeleteTech} />
        </S.Wrapper>

        <S.EditIcon size={16} onClick={handleToggleEditForm} />
      </S.Content>

      <S.Grow
        initial={false}
        animate={isOpenEditForm ? 'open' : 'closed'}
        variants={variants.icons_container}
      >
        {groups(tech).map(group => (
          <GroupFields key={group.id} {...group} />
        ))}
      </S.Grow>
    </S.Container>
  );
};

const EditSocialItemFoward = forwardRef(EditSocialItem);
export { EditSocialItemFoward as EditSocialItem };