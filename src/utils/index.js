export const generateLoadingData = size =>
  Array.from({length: size}, (_, i) => i);

export const handleScrollEventFunc = ({
  event,
  direction,
  offset,
  dispatch,
  setScrollDirection,
}) => {
  let currentOffset = event.nativeEvent.contentOffset.y;
  let currentDirection =
    currentOffset > offset.current ||
    (direction.current == 'down' && currentOffset == offset.current)
      ? 'down'
      : 'up';
  if (direction.current !== currentDirection)
    direction.current = currentDirection;
  dispatch(setScrollDirection(currentDirection));
  offset.current = currentOffset;
};
