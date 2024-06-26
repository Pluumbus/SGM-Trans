import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

export const AddWeek = () => {
  const { isOpen: isOpenTrip, onOpenChange: onOpenChangeTrip } =
    useDisclosure();
  const { isOpen: isOpenCargo, onOpenChange: onOpenChangeCargo } =
    useDisclosure();
  return (
    <div>
      <div className="w-full flex justify-end">
        <Button
          onClick={() => {
            onOpenChangeTrip();
          }}
        >
          Добавить неделю
        </Button>
      </div>
      <Modal isOpen={isOpenTrip} onOpenChange={onOpenChangeTrip} size="2xl">
        <ModalContent>
          <ModalHeader>Добавить рейс</ModalHeader>
          <Divider />
          <ModalBody>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Autocomplete label="Выберите область">
                <AutocompleteItem key="Акмолинская область">
                  Акмолинская область
                </AutocompleteItem>
                <AutocompleteItem key="Актюбинская область">
                  Актюбинская область
                </AutocompleteItem>
                <AutocompleteItem key="Алматинская область">
                  Алматинская область
                </AutocompleteItem>
                <AutocompleteItem key="Атырауская область">
                  Атырауская область
                </AutocompleteItem>
                <AutocompleteItem key="Восточно-Казахстанская область">
                  Восточно-Казахстанская область
                </AutocompleteItem>
                <AutocompleteItem key="Жамбылская область">
                  Жамбылская область
                </AutocompleteItem>
                <AutocompleteItem key="Западно-Казахстанская область">
                  Западно-Казахстанская область
                </AutocompleteItem>
                <AutocompleteItem key="Карагандинская область">
                  Карагандинская область
                </AutocompleteItem>
                <AutocompleteItem key="Костанайская область">
                  Костанайская область
                </AutocompleteItem>
                <AutocompleteItem key="Кызылординская область">
                  Кызылординская область
                </AutocompleteItem>
                <AutocompleteItem key="Мангистауская область">
                  Мангистауская область
                </AutocompleteItem>
                <AutocompleteItem key="Павлодарская область">
                  Павлодарская область
                </AutocompleteItem>
                <AutocompleteItem key="Северо-Казахстанская область">
                  Северо-Казахстанская область
                </AutocompleteItem>
                <AutocompleteItem key="Туркестанская область">
                  Туркестанская область
                </AutocompleteItem>
                <AutocompleteItem key="Улытауская область">
                  Улытауская область
                </AutocompleteItem>
                <AutocompleteItem key="Жетысуская область">
                  Жетысуская область
                </AutocompleteItem>
              </Autocomplete>
              <Autocomplete label="Выберите город">
                <AutocompleteItem key="г. Астана">г. Астана</AutocompleteItem>
                <AutocompleteItem key="г. Алматы">г. Алматы</AutocompleteItem>
                <AutocompleteItem key="г. Шымкент">г. Шымкент</AutocompleteItem>
                <AutocompleteItem key="г. Актау">г. Актау</AutocompleteItem>
                <AutocompleteItem key="г. Актобе">г. Актобе</AutocompleteItem>
                <AutocompleteItem key="г. Атырау">г. Атырау</AutocompleteItem>
                <AutocompleteItem key="г. Балхаш">г. Балхаш</AutocompleteItem>
                <AutocompleteItem key="г. Капшагай">
                  г. Капшагай
                </AutocompleteItem>
                <AutocompleteItem key="г. Кокшетау">
                  г. Кокшетау
                </AutocompleteItem>
                <AutocompleteItem key="г. Костанай">
                  г. Костанай
                </AutocompleteItem>
                <AutocompleteItem key="г. Караганда">
                  г. Караганда
                </AutocompleteItem>
                <AutocompleteItem key="г. Кызылорда">
                  г. Кызылорда
                </AutocompleteItem>
                <AutocompleteItem key="г. Павлодар">
                  г. Павлодар
                </AutocompleteItem>
                <AutocompleteItem key="г. Петропавловск">
                  г. Петропавловск
                </AutocompleteItem>
                <AutocompleteItem key="г. Семей">г. Семей</AutocompleteItem>
                <AutocompleteItem key="г. Талдыкорган">
                  г. Талдыкорган
                </AutocompleteItem>
                <AutocompleteItem key="г. Тараз">г. Тараз</AutocompleteItem>
                <AutocompleteItem key="г. Уральск">г. Уральск</AutocompleteItem>
                <AutocompleteItem key="г. Усть-Каменогорск">
                  г. Усть-Каменогорск
                </AutocompleteItem>
                <AutocompleteItem key="г. Экибастуз">
                  г. Экибастуз
                </AutocompleteItem>
              </Autocomplete>
            </div>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              variant="light"
              color="danger"
              onClick={() => {
                onOpenChangeTrip();
              }}
            >
              Отмена
            </Button>
            <Button
              variant="flat"
              color="success"
              onClick={() => {
                onOpenChangeTrip();
                onOpenChangeCargo();
              }}
            >
              Далее
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenCargo} onOpenChange={onOpenChangeCargo} size="2xl">
        <ModalContent>
          <ModalHeader>Добавить груз</ModalHeader>
          <Divider />
          <ModalBody>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Input label="ID" />
              <Input label="Дата создания" />
              <Input label="Адрес получения" />
              <Input label="Город разгрузки" />
              <Input label="Вес" />
              <Input label="Объем" />
              <Input label="Количество" />
              <Input label="Водитель" />
              <Input label="Сумма" />
              <Input label="Распалетирование" />
              <Input label="Комментарии" />
              <Input label="Имя клиента" />
              <Input label="БИН клиента" />
              <Input label="Название груза" />
              <Input label="Плательщик" />
              <Input label="Менеджер по перевозкам" />
              <Input label="Наличие документов" />
              <Input label="Статус" />
              <Input label="Дата прибытия" />
              <Input label="Менеджер SGM" />
              <Input label="Оплата" />
              <Input label="Схема загрузки" />
              <Input label="ID пользователя" />
            </div>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              variant="light"
              color="danger"
              onClick={() => {
                onOpenChangeCargo();
              }}
            >
              Отмена
            </Button>
            <Button variant="flat" color="success">
              Далее
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
